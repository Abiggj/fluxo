import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const adminPassword = await bcrypt.hash("planner07", saltRounds);

  // ------------------------------
  // Create Permissions
  // ------------------------------
  const permissions = [
    "project:create",
    "project:read",
    "project:update",
    "project:delete",
    "task:create",
    "task:read",
    "task:update",
    "task:delete",
    "team:create",
    "team:read",
    "team:update",
    "team:delete",
    "work:create",
    "work:read",
    "work:update",
    "work:delete",
    "invitation:create",
    "invitation:read",
    "invitation:update",
    "invitation:delete",
    "comment:create",
    "comment:read",
    "comment:update",
    "comment:delete",
  ];

  const permissionRecords = {};
  for (const perm of permissions) {
    let record = await prisma.permission.upsert({
      where: { name: perm },
      update: {},
      create: { name: perm },
    });

    permissionRecords[perm] = record;
  }

  console.log(`✅ Created/Updated ${Object.keys(permissionRecords).length} permissions`);

  // ------------------------------
  // Role setup with implicit many-to-many
  // ------------------------------
  const roles = {
    ADMIN: permissions,
    MANAGER: permissions.filter((p) => !p.endsWith(":delete")), // All except delete
    DEVELOPER: [
      "project:read",
      "task:read",
      "task:update",
      "team:read",
      "work:read",
      "comment:create",
      "comment:read",
      "comment:update",
      "comment:delete",
    ],
    GUEST: ["project:read", "task:read", "team:read", "work:read", "comment:read"],
  };

  const roleRecords = {};
  for (const [roleName, perms] of Object.entries(roles)) {
    // Get permission IDs for this role
    const permissionConnections = perms.map((perm) => ({ 
      id: permissionRecords[perm].id 
    }));

    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {
        permissions: {
          set: permissionConnections, // Replace all existing permissions
        },
      },
      create: {
        name: roleName,
        permissions: {
          connect: permissionConnections, // Connect permissions on create
        },
      },
    });

    roleRecords[roleName] = role;
    console.log(`✅ Created/Updated role: ${roleName} with ${perms.length} permissions`);
  }

  // ------------------------------
  // Users
  // ------------------------------
  const users = [
    {
      name: "Admin User",
      email: "admin@fluxo.com",
      password: hashedPassword,
      roleId: roleRecords["ADMIN"].id,
    },
    {
      name: "Manager User",
      email: "manager@fluxo.com",
      password: hashedPassword,
      roleId: roleRecords["MANAGER"].id,
    },
    {
      name: "Developer User",
      email: "developer@fluxo.com",
      password: hashedPassword,
      roleId: roleRecords["DEVELOPER"].id,
    },
    {
      name: "Guest User",
      email: "guest@fluxo.com",
      password: hashedPassword,
      roleId: roleRecords["GUEST"].id,
    },
    {
      name: "Aniket Jhariya",
      email: "aniket.jhariya@diacto.com",
      password: adminPassword,
      roleId: roleRecords["ADMIN"].id,
    },
  ];

  for (const user of users) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        roleId: user.roleId,
        // Don't update password if user already exists
      },
      create: user,
    });
    
    console.log(`✅ Created/Updated user: ${createdUser.email}`);
  }

  console.log("✅ Default roles, permissions, and users seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
