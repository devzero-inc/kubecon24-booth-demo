import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3'

const BUCKET_NAME = 'kubecon-booth-1080b684c6ad44c9b835761fa92dece8'

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

export async function getImageData(page: number, limit: number, lastKey?: string): Promise<{ images: ImageData[], pagination: PaginationData }> {
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
    throw error
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