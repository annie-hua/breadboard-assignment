# Breadboard Assignment

This project is a NestJS-based application for managing and retrieving part information. It includes a `PartsController` that handles requests to fetch aggregated part details.

## Features

- **Get Part Information**: Retrieve detailed information about a part using its part number.
- **Service-Oriented Architecture**: Uses a `PartsService` to handle business logic.

## Endpoints

### `GET /parts`
Fetch aggregated part details by providing a `partNumber` as a query parameter.

#### Example Request:
```http
GET /parts?partNumber=12345
```
#### Running the Application:
npm run start