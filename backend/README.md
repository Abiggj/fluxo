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

## Database Schema

The database schema is defined using Prisma. It consists of several models that represent the core entities of the Fluxo application.

### Enums

| Enum                  | Values                                                     | Description                                                 |
| --------------------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| `OrgRole`             | `OWNER`, `ADMIN`, `MEMBER`, `GUEST`                        | Defines roles within an organization.                       |
| `ProjectRole`         | `MANAGER`, `DESIGNER`, `DEVELOPER`, `QA`, `VIEWER`         | Defines roles within a project.                             |
| `ProjectStatus`       | `PLANNED`, `ACTIVE`, `ON_HOLD`, `COMPLETED`, `ARCHIVED`    | Represents the lifecycle of a project.                      |
| `SprintStatus`        | `PLANNED`, `ACTIVE`, `COMPLETED`                           | Represents the status of a sprint.                          |
| `TaskType`            | `GOAL_BASED`, `DURATION_BASED`                             | Differentiates tasks based on their goal.                   |
| `TaskStatus`          | `ASSIGNED`, `IN_REVIEW`, `COMPLETED`, `DUE`                | Tracks the progress of a task.                              |
| `TaskPriority`        | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`                        | Represents the urgency of a task.                           |
| `ChangeRequestStatus` | `PENDING`, `APPROVED`, `REJECTED`, `IMPLEMENTED`, `CLOSED` | Represents the status of a change request.                  |
| `ApprovalStatus`      | `PENDING`, `APPROVED`, `REJECTED`                          | Represents the status of an approval on a change request.   |
| `ActivityType`        | (Various)                                                  | Describes the type of activity that occurred for auditing.  |

### Core Models

#### `Organization`

| Field       | Type         | Description                                  |
| ----------- | ------------ | -------------------------------------------- |
| `id`        | `String`     | Unique identifier for the organization.      |
| `name`      | `String`     | Name of the organization.                    |
| `slug`      | `String`     | Unique slug for the organization.            |
| `users`     | `User[]`     | List of users in the organization.           |
| `projects`  | `Project[]`  | List of projects in the organization.        |
| `labels`    | `Label[]`    | List of labels in the organization.          |
| `createdAt` | `DateTime`   | Timestamp of when the organization was created. |
| `updatedAt` | `DateTime`   | Timestamp of when the organization was last updated. |

#### `User`

| Field                | Type                   | Description                                  |
| -------------------- | ---------------------- | -------------------------------------------- |
| `id`                 | `String`               | Unique identifier for the user.              |
| `email`              | `String`               | User's email address (unique).               |
| `name`               | `String`               | User's name.                                 |
| `passwordHash`       | `String`               | Hashed password for the user.                |
| `avatarUrl`          | `String?`              | URL for the user's avatar image.             |
| `org`                | `Organization`         | The organization the user belongs to.        |
| `orgId`              | `String`               | Foreign key for the `Organization`.          |
| `orgRole`            | `OrgRole`              | User's role within the organization.         |
| `projectMemberships` | `ProjectMember[]`      | List of project memberships for the user.    |
| `createdTasks`       | `Task[]`               | List of tasks created by the user.           |
| `assignedTasks`      | `Task[]`               | List of tasks assigned to the user.          |
| `reviewedTasks`      | `Task[]`               | List of tasks reviewed by the user.          |
| `comments`           | `Comment[]`            | List of comments made by the user.           |
| `activities`         | `Activity[]`           | List of activities performed by the user.    |
| `changeRequests`     | `ChangeRequest[]`      | List of change requests proposed by the user.|
| `approvals`          | `ChangeRequestApproval[]` | List of approvals made by the user.        |
| `createdAt`          | `DateTime`             | Timestamp of when the user was created.      |
| `updatedAt`          | `DateTime`             | Timestamp of when the user was last updated. |

#### `Project`

| Field          | Type            | Description                                  |
| -------------- | --------------- | -------------------------------------------- |
| `id`           | `String`        | Unique identifier for the project.           |
| `org`          | `Organization`  | The organization the project belongs to.     |
| `orgId`        | `String`        | Foreign key for the `Organization`.          |
| `name`         | `String`        | Name of the project.                         |
| `key`          | `String?`       | Unique key for the project.                  |
| `description`  | `String?`       | Description of the project.                  |
| `startDate`    | `DateTime?`     | Start date of the project.                   |
| `endDate`      | `DateTime?`     | End date of the project.                     |
| `status`       | `ProjectStatus` | Status of the project.                       |
| `members`      | `ProjectMember[]` | List of members in the project.            |
| `sprints`      | `Sprint[]`      | List of sprints in the project.              |
| `tasks`        | `Task[]`        | List of tasks in the project.                |
| `changeRequests` | `ChangeRequest[]` | List of change requests for the project.   |
| `activities`   | `Activity[]`    | List of activities for the project.          |
| `comments`     | `Comment[]`     | List of comments for the project.            |
| `createdAt`    | `DateTime`      | Timestamp of when the project was created.   |
| `updatedAt`    | `DateTime`      | Timestamp of when the project was last updated. |

#### `ProjectMember`

| Field       | Type         | Description                                  |
| ----------- | ------------ | -------------------------------------------- |
| `id`        | `String`     | Unique identifier for the project member.    |
| `user`      | `User`       | The user who is a member of the project.     |
| `userId`    | `String`     | Foreign key for the `User`.                  |
| `project`   | `Project`    | The project the user is a member of.         |
| `projectId` | `String`     | Foreign key for the `Project`.               |
| `role`      | `ProjectRole`| The role of the user in the project.         |
| `createdAt` | `DateTime`   | Timestamp of when the member was added.      |

### Sprints & Tasks

#### `Sprint`

| Field       | Type         | Description                                  |
| ----------- | ------------ | -------------------------------------------- |
| `id`        | `String`     | Unique identifier for the sprint.            |
| `project`   | `Project`    | The project the sprint belongs to.           |
| `projectId` | `String`     | Foreign key for the `Project`.               |
| `name`      | `String`     | Name of the sprint.                          |
| `goal`      | `String?`    | The goal of the sprint.                      |
| `startDate` | `DateTime`   | Start date of the sprint.                    |
| `endDate`   | `DateTime`   | End date of the sprint.                      |
| `status`    | `SprintStatus`| Status of the sprint.                        |
| `tasks`     | `Task[]`     | List of tasks in the sprint.                 |
| `comments`  | `Comment[]`  | List of comments on the sprint.              |
| `createdAt` | `DateTime`   | Timestamp of when the sprint was created.    |
| `updatedAt` | `DateTime`   | Timestamp of when the sprint was last updated. |

#### `Task`

| Field          | Type           | Description                                  |
| -------------- | -------------- | -------------------------------------------- |
| `id`           | `String`       | Unique identifier for the task.              |
| `project`      | `Project`      | The project the task belongs to.             |
| `projectId`    | `String`       | Foreign key for the `Project`.               |
| `sprint`       | `Sprint?`      | The sprint the task belongs to.              |
| `sprintId`     | `String?`      | Foreign key for the `Sprint`.                |
| `title`        | `String`       | Title of the task.                           |
| `description`  | `String?`      | Description of the task.                     |
| `type`         | `TaskType`     | Type of the task.                            |
| `status`       | `TaskStatus`   | Status of the task.                          |
| `priority`     | `TaskPriority` | Priority of the task.                        |
| `assignee`     | `User?`        | The user the task is assigned to.            |
| `assigneeId`   | `String?`      | Foreign key for the assigned `User`.         |
| `createdBy`    | `User`         | The user who created the task.               |
| `createdById`  | `String`       | Foreign key for the creating `User`.         |
| `reviewer`     | `User?`        | The user who reviews the task.               |
| `reviewerId`   | `String?`      | Foreign key for the reviewing `User`.        |
| `goal`         | `String?`      | The goal of the task.                        |
| `startDate`    | `DateTime?`    | Start date of the task.                      |
| `dueDate`      | `DateTime?`    | Due date of the task.                        |
| `estimatedHours`| `Float?`      | Estimated hours to complete the task.        |
| `actualHours`  | `Float?`       | Actual hours spent on the task.              |
| `attachments`  | `TaskAttachment[]` | List of attachments for the task.        |
| `labels`       | `TaskLabel[]`  | List of labels for the task.                 |
| `comments`     | `Comment[]`    | List of comments on the task.                |
| `activities`   | `Activity[]`   | List of activities for the task.             |
| `createdAt`    | `DateTime`     | Timestamp of when the task was created.      |
| `updatedAt`    | `DateTime`     | Timestamp of when the task was last updated. |
| `deletedAt`    | `DateTime?`    | Timestamp of when the task was soft-deleted. |

### Change Management

#### `ChangeRequest`

| Field         | Type                  | Description                                  |
| ------------- | --------------------- | -------------------------------------------- |
| `id`          | `String`              | Unique identifier for the change request.    |
| `project`     | `Project`             | The project the change request belongs to.   |
| `projectId`   | `String`              | Foreign key for the `Project`.               |
| `proposer`    | `User`                | The user who proposed the change request.    |
| `proposerId`  | `String`              | Foreign key for the `User`.                  |
| `title`       | `String`              | Title of the change request.                 |
| `description` | `String`              | Description of the change request.           |
| `status`      | `ChangeRequestStatus` | Status of the change request.                |
| `approvals`   | `ChangeRequestApproval[]` | List of approvals for the change request. |
| `comments`    | `Comment[]`           | List of comments on the change request.      |
| `activities`  | `Activity[]`          | List of activities for the change request.   |
| `createdAt`   | `DateTime`            | Timestamp of when the change request was created. |
| `updatedAt`   | `DateTime`            | Timestamp of when the change request was last updated. |

#### `ChangeRequestApproval`

| Field           | Type             | Description                                  |
| --------------- | ---------------- | -------------------------------------------- |
| `id`            | `String`         | Unique identifier for the approval.          |
| `changeRequest` | `ChangeRequest`  | The change request being approved.           |
| `changeRequestId`| `String`        | Foreign key for the `ChangeRequest`.         |
| `reviewer`      | `User`           | The user reviewing the change request.       |
| `reviewerId`    | `String`         | Foreign key for the `User`.                  |
| `status`        | `ApprovalStatus` | Status of the approval.                      |
| `comment`       | `String?`        | An optional comment with the approval.       |
| `createdAt`     | `DateTime`       | Timestamp of when the approval was created.  |
| `updatedAt`     | `DateTime`       | Timestamp of when the approval was last updated. |

### Generic Collaboration & Audit

#### `Comment`

| Field           | Type            | Description                                  |
| --------------- | --------------- | -------------------------------------------- |
| `id`            | `String`        | Unique identifier for the comment.           |
| `author`        | `User`          | The user who wrote the comment.              |
| `authorId`      | `String`        | Foreign key for the `User`.                  |
| `body`          | `String`        | The content of the comment.                  |
| `targetId`      | `String`        | The ID of the resource being commented on.   |
| `targetType`    | `String`        | The type of the resource (e.g., "Task").     |
| `task`          | `Task?`         | The task the comment belongs to.             |
| `taskId`        | `String?`       | Foreign key for the `Task`.                  |
| `project`       | `Project?`      | The project the comment belongs to.          |
| `projectId`     | `String?`       | Foreign key for the `Project`.               |
| `sprint`        | `Sprint?`       | The sprint the comment belongs to.           |
| `sprintId`      | `String?`       | Foreign key for the `Sprint`.                |
| `changeRequest` | `ChangeRequest?`| The change request the comment belongs to.   |
| `changeRequestId`| `String?`      | Foreign key for the `ChangeRequest`.         |
| `createdAt`     | `DateTime`      | Timestamp of when the comment was created.   |
| `updatedAt`     | `DateTime`      | Timestamp of when the comment was last updated. |

#### `Activity`

| Field           | Type            | Description                                  |
| --------------- | --------------- | -------------------------------------------- |
| `id`            | `String`        | Unique identifier for the activity.          |
| `actor`         | `User`          | The user who performed the activity.         |
| `actorId`       | `String`        | Foreign key for the `User`.                  |
| `type`          | `ActivityType`  | The type of activity.                        |
| `details`       | `Json?`         | Additional details about the activity.       |
| `targetId`      | `String`        | The ID of the resource the activity is on.   |
| `targetType`    | `String`        | The type of the resource (e.g., "Task").     |
| `task`          | `Task?`         | The task the activity belongs to.            |
| `taskId`        | `String?`       | Foreign key for the `Task`.                  |
| `project`       | `Project?`      | The project the activity belongs to.         |
| `projectId`     | `String?`       | Foreign key for the `Project`.               |
| `changeRequest` | `ChangeRequest?`| The change request the activity belongs to.  |
| `changeRequestId`| `String?`      | Foreign key for the `ChangeRequest`.         |
| `createdAt`     | `DateTime`      | Timestamp of when the activity was created.  |

### Attachments & Labels

#### `TaskAttachment`

| Field       | Type       | Description                                  |
| ----------- | ---------- | -------------------------------------------- |
| `id`        | `String`   | Unique identifier for the attachment.        |
| `task`      | `Task`     | The task the attachment belongs to.          |
| `taskId`    | `String`   | Foreign key for the `Task`.                  |
| `url`       | `String`   | URL of the attachment.                       |
| `fileName`  | `String`   | Name of the attachment file.                 |
| `mimeType`  | `String?`  | Mime type of the attachment.                 |
| `sizeBytes` | `Int?`     | Size of the attachment in bytes.             |
| `createdAt` | `DateTime` | Timestamp of when the attachment was created.|

#### `Label`

| Field       | Type         | Description                                  |
| ----------- | ------------ | -------------------------------------------- |
| `id`        | `String`     | Unique identifier for the label.             |
| `org`       | `Organization`| The organization the label belongs to.       |
| `orgId`     | `String`     | Foreign key for the `Organization`.          |
| `name`      | `String`     | Name of the label.                           |
| `color`     | `String?`    | Color of the label.                          |
| `tasks`     | `TaskLabel[]`| List of tasks with this label.               |
| `createdAt` | `DateTime`   | Timestamp of when the label was created.     |
| `updatedAt` | `DateTime`   | Timestamp of when the label was last updated.|

#### `TaskLabel`

| Field     | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| `task`    | `Task` | The task the label is applied to.    |
| `taskId`  | `String`| Foreign key for the `Task`.          |
| `label`   | `Label`| The label applied to the task.       |
| `labelId` | `String`| Foreign key for the `Label`.         |
