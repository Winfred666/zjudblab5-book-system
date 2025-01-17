FROM node:20-alpine AS base

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Install python/pip

# RUN apk --no-cache --virtual build-dependencies add \
#        python \
#        make \
#        g++

RUN apk add g++ make py3-pip


WORKDIR /app

RUN npm config set registry https://registry.npm.taobao.org\
 && npm config set registry http://r.cnpmjs.org/

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN npm ci;


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1


RUN npm run rundb \
&& npm run dummy



ENV NODE_ENV=production
ENV NEXTAUTH_SECRET="Wp35jIb/R/zcHlpVb4Rqpk0VACOdtyjTqc6slrCViQE="
ENV NEXT_PUBLIC_URL="https://121.40.46.192"
ENV NEXTAUTH_URL="https://121.40.46.192"

RUN npm run build;

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app


ENV NODE_ENV=production
ENV NEXTAUTH_SECRET="Wp35jIb/R/zcHlpVb4Rqpk0VACOdtyjTqc6slrCViQE="
ENV NEXT_PUBLIC_URL="https://121.40.46.192"
ENV NEXTAUTH_URL="https://121.40.46.192"



# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/mydb.db ./mydb.db

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER root

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js