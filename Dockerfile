# Build stage
FROM node:22 AS builder
WORKDIR /app

# Install yarn
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with yarn
RUN yarn install --immutable --network-timeout 100000

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:22 AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Create system group and user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Install yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/package.json /app/yarn.lock ./

# Install production dependencies only
RUN yarn install --production --frozen-lockfile --network-timeout 100000

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set hostname
ENV HOSTNAME="0.0.0.0"

# Command to run the application
CMD ["node", "server.js"]