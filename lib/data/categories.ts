import type { Category as CategoryType } from "@/lib/types";
import dbConnect from "@/lib/mongoose";
import Category from "@/models/Category";
// import Product from "@/models/Product";
import { toPlainObject } from "@/lib/utils";

export async function getCategories(): Promise<CategoryType[]> {
  await dbConnect();
  const categories = await Category.find().lean();
  return toPlainObject(
    categories.map((c: any) => ({
      ...c,
      id: c._id.toString(),
      parentId: c.parentId?.toString(),
    })),
  );
}

export async function getRootCategories(): Promise<CategoryType[]> {
  await dbConnect();
  const categories = await Category.find({ parentId: null }).lean();
  return toPlainObject(
    categories.map((c: any) => ({
      ...c,
      id: c._id.toString(),
    })),
  );
}

export async function getChildCategories(
  parentId: string,
): Promise<CategoryType[]> {
  await dbConnect();
  const categories = await Category.find({ parentId }).lean();
  return toPlainObject(
    categories.map((c: any) => ({
      ...c,
      id: c._id.toString(),
      parentId: c.parentId?.toString(),
    })),
  );
}

export async function getCategoryById(
  id: string,
): Promise<CategoryType | null> {
  await dbConnect();
  const c = (await Category.findById(id).lean()) as any;
  if (!c) return null;
  return toPlainObject({
    ...c,
    id: c._id.toString(),
    parentId: c.parentId?.toString(),
  });
}

export async function getCategoriesByActive(
  isActive: boolean,
): Promise<CategoryType[]> {
  await dbConnect();
  const categories = await Category.find({ isActive }).lean();
  return toPlainObject(
    categories.map((c: any) => ({
      ...c,
      id: c._id.toString(),
      parentId: c.parentId?.toString(),
    })),
  );
}

export async function getFeaturedCategories(): Promise<CategoryType[]> {
  await dbConnect();
  const categories = await Category.find({
    isFeatured: true,
    parentId: null,
  }).lean();
  return toPlainObject(
    categories.map((c: any) => ({
      ...c,
      id: c._id.toString(),
      parentId: c.parentId?.toString(),
    })),
  );
}

export async function searchCategories(query: string): Promise<CategoryType[]> {
  await dbConnect();
  const regex = new RegExp(query, "i");
  const categories = await Category.find({
    $or: [{ name: regex }, { slug: regex }],
  }).lean();
  return toPlainObject(
    categories.map((c: any) => ({
      ...c,
      id: c._id.toString(),
      parentId: c.parentId?.toString(),
    })),
  );
}

export async function getCategoryPath(
  categoryId: string,
): Promise<CategoryType[]> {
  await dbConnect();
  const path: CategoryType[] = [];
  let currentId: string | undefined = categoryId;

  while (currentId) {
    const category = (await Category.findById(currentId).lean()) as any;
    if (!category) break;
    path.unshift(
      toPlainObject({
        ...category,
        id: category._id.toString(),
        parentId: category.parentId?.toString(),
      }),
    );
    currentId = category.parentId?.toString();
  }

  return path;
}

export async function canAssignParent(
  categoryId: string,
  newParentId: string | undefined,
): Promise<{ canAssign: boolean; reason?: string }> {
  if (!newParentId) return { canAssign: true };

  await dbConnect();
  const parentCategory = (await Category.findById(newParentId).lean()) as any;
  if (!parentCategory)
    return { canAssign: false, reason: "Parent category not found" };

  if (parentCategory.productCount > 0) {
    return {
      canAssign: false,
      reason: "Cannot assign to a parent category that has products",
    };
  }

  const children = await Category.find({ parentId: categoryId }).lean();
  if (children.some((c) => c._id.toString() === newParentId)) {
    return { canAssign: false, reason: "Cannot create circular hierarchy" };
  }

  return { canAssign: true };
}

export async function canHaveProducts(
  categoryId: string,
): Promise<{ canHave: boolean; reason?: string }> {
  await dbConnect();
  const category = await Category.findById(categoryId).lean();
  if (!category) return { canHave: false, reason: "Category not found" };

  const childCount = await Category.countDocuments({ parentId: categoryId });
  if (childCount > 0) {
    return {
      canHave: false,
      reason: "Cannot add products to a category that has child categories",
    };
  }

  return { canHave: true };
}
