# Bundle static assets with nginx
FROM nginx:alpine as fron-production
ENV NODE_ENV production
# Copy built assets from `builder` image
COPY --from=builder /dist /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]