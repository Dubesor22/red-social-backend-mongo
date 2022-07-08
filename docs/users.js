module.exports = {
  paths: {
    "/users": {
      get: {
        tags: {
          Users: "Get Users",
        },
        description:
          "Obtiene todos los usuarios registrados en la base de datos",
        operationId: "getUsers",
        parameters: [],
        responses: {
          200: {
            description: "Users were obtained",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/userGet",
                },
              },
            },
          },
        },
      },
      post: {
        tags: {
          Users: "Create Users",
        },
        description:
          "Endpoint para crear usuario, los campos 'username', 'password' y 'email' son obligatorios",
        operationId: "createUsers",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userCreate",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
          },
          500: {
            description: "Server error",
          },
        },
      },
      delete: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Users: "Delete a user",
        },
        description: "Deleting a User",
        operationId: "deleteUser",
        parameters: [],
        responses: {
          200: { description: "User deleted successfully" },
          404: { description: "User not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/users/id/{_id}": {
      put: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Users: "Update a user",
        },
        description: "Update User",
        operationId: "updateUser",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
            description: "Introduce the id user you want to update",
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/userUpdate" },
            },
          },
        },
        responses: {
          200: { description: "User updated successfully" },
          404: { description: "User not found" },
          500: { description: "Server error" },
        },
      },
    },
  },
};
