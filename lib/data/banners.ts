import dbConnect from "@/lib/mongoose";
import Banner from "@/models/Banner";
import { toPlainObject } from "@/lib/utils";

export async function getBanners() {
  await dbConnect();
  const banners = await Banner.find().sort({ order: 1 }).lean();
  return toPlainObject(
    banners.map((b: any) => ({
      ...b,
      id: b._id.toString(),
    }))
  );
}

export async function getBannerById(id: string) {
  await dbConnect();
  try {
    const b = (await Banner.findById(id).lean()) as any;
    if (!b) return null;
    return toPlainObject({
      ...b,
      id: b._id.toString(),
    });
  } catch (e) {
    return null;
  }
}
