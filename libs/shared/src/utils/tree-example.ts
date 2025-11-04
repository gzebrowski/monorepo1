/**
 * Example usage of TreeManager class
 * 
 * This example demonstrates how to use TreeManager with a Prisma model
 * that has the required tree fields (id, path, depth).
 */

/*
import { PrismaClient } from '@prisma/client';
import { TreeManager } from './tree';

// Example with the Departments model from your schema
const prisma = new PrismaClient();

// Create a TreeManager instance for the Departments model
const departmentTreeManager = new TreeManager(prisma.departments);

// Example usage:
export async function exampleUsage() {
  // Add a root department
  const rootDept = await departmentTreeManager.addRoot({
    name: 'Engineering',
    managerId: 1,
    parentDepartmentId: null,
  });

  console.log('Created root department:', rootDept);

  // Add a child department
  const childDept = await departmentTreeManager.addChild(rootDept, {
    name: 'Frontend Team',
    managerId: 2,
    parentDepartmentId: rootDept.id,
    deleted: false
  });

  console.log('Created child department:', childDept);

  // Add a sibling department
  const siblingDept = await departmentTreeManager.addSibling(childDept, {
    name: 'Backend Team',
    managerId: 3,
    parentDepartmentId: rootDept.id
  }, 'right');

  console.log('Created sibling department:', siblingDept);

  // Get all children of root department
  const children = await departmentTreeManager.getChildren(rootDept);
  console.log('Children of root department:', children);

  // Get all descendants (children, grandchildren, etc.)
  const descendants = await departmentTreeManager.getDescendants(rootDept);
  console.log('All descendants of root department:', descendants);

  // Move a department
  const anotherRoot = await departmentTreeManager.addRoot({
    name: 'Marketing',
    managerId: 4,
    parentDepartmentId: null
  });

  // Move Frontend Team under Marketing
  await departmentTreeManager.move(childDept, anotherRoot, 'first-child');
  console.log('Moved Frontend Team under Marketing');

  // Get all root departments
  const roots = await departmentTreeManager.getRoots();
  console.log('All root departments:', roots);
}

// Type-safe usage with your specific model
type DepartmentTreeNode = {
  id: number;
  path: string | null;
  depth: number | null;
  name: string;
  managerId: number | null;
  parentDepartmentId: string | null;
  deleted: boolean;
};

// You can also create a specialized class for your specific model
export class DepartmentTreeManager extends TreeManager<DepartmentTreeNode> {
  constructor(prisma: PrismaClient) {
    super(prisma.departments);
  }

  // Add department-specific methods
  async getActiveDepartments(): Promise<DepartmentTreeNode[]> {
    return await this.queryset.findMany({
      where: {
        deleted: false
      },
      orderBy: {
        path: 'asc'
      }
    });
  }

  async getDepartmentsByManager(managerEmail: string): Promise<DepartmentTreeNode[]> {
    return await this.queryset.findMany({
      where: {
        managerEmail: managerEmail,
        deleted: false
      },
      orderBy: {
        path: 'asc'
      }
    });
  }

  async softDeleteDepartment(department: DepartmentTreeNode): Promise<void> {
    // Mark department and all descendants as deleted
    if (!department.path) {
      throw new Error('Department must have a valid path');
    }

    await this.queryset.updateMany({
      where: {
        path: {
          startsWith: department.path
        }
      },
      data: {
        deleted: true
      }
    });
  }
}
*/