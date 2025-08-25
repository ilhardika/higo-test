import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Higo Customer Analytics API",
      version: "1.0.0",
      description:
        "REST API for customer analytics dashboard with MongoDB backend",
      contact: {
        name: "API Support",
        email: "support@higo.com",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://your-backend-url.railway.app/api"
            : "http://localhost:4000/api",
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      schemas: {
        Record: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "MongoDB ObjectId",
            },
            number: {
              type: "number",
              description: "Record number",
            },
            locationName: {
              type: "string",
              description: "Name of the location",
            },
            date: {
              type: "string",
              format: "date",
              description: "Visit date",
            },
            loginHour: {
              type: "string",
              description: "Login hour time",
            },
            name: {
              type: "string",
              description: "Customer name",
            },
            age: {
              type: "number",
              description: "Customer age",
            },
            gender: {
              type: "string",
              enum: ["Male", "Female"],
              description: "Customer gender",
            },
            email: {
              type: "string",
              format: "email",
              description: "Customer email",
            },
            phone: {
              type: "string",
              description: "Customer phone number",
            },
            brandDevice: {
              type: "string",
              description: "Device brand used",
            },
            digitalInterest: {
              type: "string",
              description: "Digital interest category",
            },
            locationType: {
              type: "string",
              description: "Type of location (urban, suburban, etc.)",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Record creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Record update timestamp",
            },
          },
        },
        PaginatedRecords: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            data: {
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Record",
                  },
                },
                pagination: {
                  type: "object",
                  properties: {
                    page: { type: "number" },
                    limit: { type: "number" },
                    total: { type: "number" },
                    totalPages: { type: "number" },
                    hasNext: { type: "boolean" },
                    hasPrev: { type: "boolean" },
                  },
                },
              },
            },
            message: {
              type: "string",
            },
            timestamp: {
              type: "string",
              format: "date-time",
            },
          },
        },
        GenderStats: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Gender (Male/Female)",
            },
            count: {
              type: "number",
              description: "Number of records",
            },
            percentage: {
              type: "number",
              description: "Percentage of total",
            },
          },
        },
        LocationStats: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Location type",
            },
            count: {
              type: "number",
              description: "Number of records",
            },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            data: {
              type: "object",
            },
            message: {
              type: "string",
            },
            timestamp: {
              type: "string",
              format: "date-time",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
            },
            message: {
              type: "string",
            },
            timestamp: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
  },
  apis: ["./src/controllers/*.ts", "./src/routes/*.ts"], // paths to files containing OpenAPI definitions
};

export const swaggerSpec = swaggerJsdoc(options);
