# Fluxo API Documentation

Welcome to the Fluxo API. This document provides a detailed overview of all available endpoints, their functionality, required permissions, and expected data formats.

## Base URL

All API endpoints are prefixed with `/api`.

---

## Authentication

Handles user registration and login.

| Method | Endpoint         | Description              | Authentication | Request Body                               |
|--------|------------------|--------------------------|----------------|--------------------------------------------|
| `POST` | `/auth/register` | Registers a new user.    | Public         | `{ "name": "...", "email": "...", "password": "..." }` |
| `POST` | `/auth/login`    | Logs in a user.          | Public         | `{ "email": "...", "password": "..." }`       |
| `GET`  | `/users/me`      | Gets the current user's profile. | Private (Token) | _None_                                     |

---

## Organizations

Routes for managing organizations. Most actions require the user to be an `OWNER` or `ADMIN` of the organization.

| Method | Endpoint         | Description              | Permissions    |
|--------|------------------|--------------------------|----------------|
| `POST` | `/orgs`          | Creates a new organization. | Org `OWNER`/`ADMIN` |
| `GET`  | `/orgs/:slug`    | Retrieves an organization's details. | Org Member |
| `PUT`  | `/orgs/:slug`    | Updates an organization. | Org `OWNER`/`ADMIN` |
| `DELETE`| `/orgs/:slug`    | Deletes an organization. | Org `OWNER` |
| `GET`  | `/orgs/:slug/users` | Lists all users in an organization. | Org Member |

---

## Projects

Routes for managing projects within an organization.

| Method | Endpoint                   | Description                   | Permissions         |
|--------|----------------------------|-------------------------------|---------------------|
| `GET`  | `/projects`                | Lists all projects the user is a member of. | Org Member          |
| `POST` | `/projects`                | Creates a new project.        | Org `OWNER`/`ADMIN` |
| `GET`  | `/projects/:projectId`     | Retrieves a single project's details. | Project Member      |
| `PUT`  | `/projects/:projectId`     | Updates a project's details.  | Project `MANAGER`   |
| `DELETE`| `/projects/:projectId`     | Deletes a project.            | Project `MANAGER`   |
| `POST` | `/projects/:projectId/members` | Adds a user to a project. | Project `MANAGER`   |
| `PUT`  | `/projects/:projectId/members/:memberId` | Updates a member's role. | Project `MANAGER`   |
| `DELETE`| `/projects/:projectId/members/:memberId` | Removes a member from a project. | Project `MANAGER`   |

---

## Sprints

Routes for managing sprints, which are time-boxed periods within a project.

| Method | Endpoint                   | Description                   | Permissions         |
|--------|----------------------------|-------------------------------|---------------------|
| `GET`  | `/projects/:projectId/sprints` | Lists all sprints in a project. | Project Member      |
| `POST` | `/projects/:projectId/sprints` | Creates a new sprint in a project. | Project `MANAGER` |
| `GET`  | `/sprints/:id`             | Retrieves a single sprint's details. | Project Member      |
| `PUT`  | `/sprints/:id`             | Updates a sprint.             | Project `MANAGER`   |
| `DELETE`| `/sprints/:id`             | Deletes a sprint.             | Project `MANAGER`   |

---

## Tasks

Routes for managing tasks within a project.

| Method | Endpoint                   | Description                   | Permissions         |
|--------|----------------------------|-------------------------------|---------------------|
| `GET`  | `/projects/:projectId/tasks` | Lists all tasks in a project. | Project Member      |
| `POST` | `/projects/:projectId/tasks` | Creates a new task in a project. | Project Member      |
| `GET`  | `/tasks/:id`               | Retrieves a single task's details. | Project Member      |
| `PUT`  | `/tasks/:id`               | Updates a task.               | Project Member      |
| `DELETE`| `/tasks/:id`               | Deletes a task.               | Project `MANAGER`   |

---

## Change Requests (CRs)

Routes for the formal change management process.

| Method | Endpoint                   | Description                   | Permissions         |
|--------|----------------------------|-------------------------------|---------------------|
| `GET`  | `/projects/:projectId/cr`  | Lists all CRs for a project.  | Project Member      |
| `POST` | `/projects/:projectId/cr`  | Creates a new CR.             | Project Member      |
| `GET`  | `/cr/:id`                  | Retrieves a single CR's details. | Project Member      |
| `PUT`  | `/cr/:id`                  | Updates a CR's title/description. | Proposer or `MANAGER` |
| `PUT`  | `/cr/:id/status`           | Updates a CR's overall status. | Project `MANAGER`   |
| `PUT`  | `/cr/:id/approvals/:approvalId` | Submits an approval (approve/reject). | Assigned Reviewer |

---

## Comments

Generic routes for adding and deleting comments on various resources.

| Method | Endpoint                   | Description                   | Permissions         |
|--------|----------------------------|-------------------------------|---------------------|
| `POST` | `/projects/:projectId/comments` | Adds a comment to a project. | Project Member      |
| `POST` | `/tasks/:id/comments`      | Adds a comment to a task.     | Project Member      |
| `POST` | `/sprints/:id/comments`    | Adds a comment to a sprint.   | Project Member      |
| `POST` | `/cr/:id/comments`         | Adds a comment to a change request. | Project Member      |
| `DELETE`| `/comments/:commentId`     | Deletes a comment.            | Author or `MANAGER` |

### Comment Request Body

When posting a comment, the `targetId` and `targetType` must be included in the body.

```json
{
  "body": "This is my comment.",
  "targetId": "cuid_of_the_resource",
  "targetType": "Project" 
}
```
*   **targetType** can be one of: `Project`, `Task`, `Sprint`, `ChangeRequest`.

---

## Users

Routes for managing users.

| Method | Endpoint         | Description              | Permissions    |
|--------|------------------|--------------------------|----------------|
| `GET`  | `/users/me`      | Gets the current user's profile. | Private (Token) |
| `GET`  | `/users`         | Lists all users in the user's org. | Org Member |
| `GET`  | `/users/:id`     | Gets a specific user's profile. | Org Member |
| `PUT`  | `/users/:id`     | Updates a user's profile. | User themselves or Org `ADMIN` |
| `DELETE`| `/users/:id`     | Deletes a user.          | Org `OWNER`/`ADMIN` |

---
