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

---

## Database Schema

The database schema is defined using Prisma. It consists of several models that represent the core entities of the Fluxo application.

### Enums

- **OrgRole**: Defines the roles a user can have within an organization (`OWNER`, `ADMIN`, `MEMBER`, `GUEST`).
- **ProjectRole**: Defines the roles a user can have within a project (`MANAGER`, `DESIGNER`, `DEVELOPER`, `QA`, `VIEWER`).
- **ProjectStatus**: Represents the lifecycle of a project (`PLANNED`, `ACTIVE`, `ON_HOLD`, `COMPLETED`, `ARCHIVED`).
- **SprintStatus**: Represents the status of a sprint (`PLANNED`, `ACTIVE`, `COMPLETED`).
- **TaskType**: Differentiates tasks based on their goal (`GOAL_BASED`, `DURATION_BASED`).
- **TaskStatus**: Tracks the progress of a task (`ASSIGNED`, `IN_REVIEW`, `COMPLETED`, `DUE`).
- **TaskPriority**: Represents the urgency of a task (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- **ChangeRequestStatus**: Represents the status of a change request (`PENDING`, `APPROVED`, `REJECTED`, `IMPLEMENTED`, `CLOSED`).
- **ApprovalStatus**: Represents the status of an approval on a change request (`PENDING`, `APPROVED`, `REJECTED`).
- **ActivityType**: Describes the type of activity that occurred for auditing purposes.

### Core Models

- **Organization**: Represents a company or a team. It has users, projects, and labels.
- **User**: Represents an individual user. A user belongs to one organization and can be a member of multiple projects.
- **Project**: Represents a project within an organization. It has members, sprints, tasks, and change requests.
- **ProjectMember**: A through-model that links a `User` to a `Project` and defines their `ProjectRole`.

### Sprints & Tasks

- **Sprint**: A time-boxed period within a project to complete a set of tasks.
- **Task**: A unit of work to be done within a project. It can be assigned to a user and has a status, priority, and type.

### Change Management

- **ChangeRequest**: A formal proposal to modify a project. It requires approvals.
- **ChangeRequestApproval**: Records the approval status from a reviewer for a specific `ChangeRequest`.

### Generic Collaboration & Audit

- **Comment**: A generic model for adding comments to various resources like tasks, projects, sprints, and change requests. It uses a polymorphic relation to associate with different models.
- **Activity**: A generic model for logging activities (e.g., creating a task, changing a status). It also uses a polymorphic relation.

### Attachments & Labels

- **TaskAttachment**: Represents a file attached to a task.
- **Label**: A tag that can be applied to tasks for categorization.
- **TaskLabel**: A through-model that links a `Task` to a `Label`.