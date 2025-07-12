# Usage Guide

## Required Query Parameters

This application requires the following query parameters to function properly:

- `keyspace` - The keyspace identifier for the API
- `role` - The role identifier for the API  
- `userId` - The user identifier for the API

## Example URL

```
http://localhost:5173/?keyspace=satudesa&role=dev&userId=3181
```

## Development Setup

1. Start the development server:
   ```bash
   bun run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5173/?keyspace=satudesa&role=dev&userId=3181
   ```

## Production Setup

When deploying to production, ensure that the URL includes the required query parameters:

```
https://your-domain.com/?keyspace=your-keyspace&role=your-role&userId=your-user-id
```

## Error Handling

If any required query parameters are missing, the application will display an error page with:
- A clear error message indicating which parameters are missing
- Instructions on how to fix the issue
- An example URL with the correct format

## Debug Mode

The application includes a debug panel (bottom-right corner) that shows:
- Current query parameters
- Which parameters are required
- Current parameter values

Click the eye icon in the bottom-right corner to toggle the debug panel.

## API Integration

The application uses these query parameters to make API calls to:
```
https://client-api.quantumbyte.ai/api/v1/informasi-umum/{keyspace}/{role}/list/{userId}
```

All API calls will automatically use the query parameters from the URL, ensuring consistent data access based on the user's context. 