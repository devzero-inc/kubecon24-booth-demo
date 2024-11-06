import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

const BUCKET_NAME = 'kubecon-booth-1080b684c6ad44c9b835761fa92dece8'

const isDevelopment = process.env.NODE_ENV === 'development'
const isPrerendering = process.env.NEXT_PHASE === 'phase-production-build'
const useMockData = (isDevelopment || isPrerendering) && !process.env.USE_REAL_S3;


const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  endpoint: process.env.AWS_ENDPOINT_URL,
  forcePathStyle: true,
})

interface ImageData {
  id: string;
  imageData: string;
  createdAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  lastKey?: string;
}


// Helper function to generate mock images
function generateMockImages(page: number, limit: number): ImageData[] {
  return Array.from({ length: limit }).map((_, index) => ({
    id: `generated/mock-image-${page}-${index}.jpg`,
    // Using a placeholder base64 image (1x1 pixel transparent PNG)
    imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(), // Creates descending dates
  }));
}

export async function getImageData(page: number, limit: number, lastKey?: string): Promise<{ images: ImageData[], pagination: PaginationData }> {
  // Return mock data during development or build time
  if (useMockData) {
    const totalItems = 100; // Mock total number of items
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      images: generateMockImages(page, limit),
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        lastKey: page < totalPages ? `generated/mock-image-${page}-${limit}.jpg` : undefined
      }
    };
  }
  
  // Production code with real S3 access
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'generated/',
      MaxKeys: limit,
      StartAfter: lastKey,
    })

    const listResponse = await s3.send(listCommand)

    const imageData = await Promise.all(
      (listResponse.Contents || []).map(async (object): Promise<ImageData> => {
        const getCommand = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: object.Key,
        })
        const response = await s3.send(getCommand)
        const imageBuffer = await response.Body?.transformToByteArray()
        const base64Image = imageBuffer ? Buffer.from(imageBuffer).toString('base64') : ''

        return {
          id: object.Key || '',
          imageData: `data:image/jpeg;base64,${base64Image}`,
          createdAt: object.LastModified?.toISOString() || new Date().toISOString(),
        }
      })
    )

    const totalObjects = await getTotalObjectCount(BUCKET_NAME, 'generated/')

    return {
      images: imageData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalObjects / limit),
        hasNextPage: !!listResponse.NextContinuationToken,
        lastKey: listResponse.Contents?.[listResponse.Contents.length - 1]?.Key
      }
    }
  } catch (error) {
    console.error('Error fetching images from S3:', error)
    
    // Optionally, return mock data as fallback in case of errors
    if (isDevelopment || isPrerendering) {
      const totalPages = Math.ceil(100 / limit);
      return {
        images: generateMockImages(page, limit),
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          hasNextPage: page < totalPages,
          lastKey: page < totalPages ? `generated/mock-image-${page}-${limit}.jpg` : undefined
        }
      };
    }
    
    throw error;
  }
}

async function getTotalObjectCount(bucket: string, prefix: string): Promise<number> {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  })

  let totalCount = 0
  let continuationToken: string | undefined

  do {
    const response = await s3.send(command)
    totalCount += response.KeyCount || 0
    continuationToken = response.NextContinuationToken
    command.input.ContinuationToken = continuationToken
  } while (continuationToken)

  return totalCount
}