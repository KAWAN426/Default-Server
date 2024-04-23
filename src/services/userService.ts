import User, { IUser, MUser } from "@/models/User";
import mongoose from "mongoose";

const userCache: { [key: string]: { user: MUser; expireAt: number } } = {};

interface IFindUserProps {
  providerId: string;
  authProvider: string;
  userId?: string | mongoose.Types.ObjectId;
}

/*
 * 사용자가 무조건 있을때: findUserByProviderId();
 * 사용자가 없을 수도 있을때: findUserByProviderId<null>({notExistError: false});
 */
export async function findUserByProviderId({
  providerId,
  authProvider,
  userId,
}: IFindUserProps) {
  const cachedData = userCache[providerId];
  if (cachedData && Date.now() < cachedData.expireAt) return cachedData.user;

  const user = await User.findOne({ providerId, authProvider }).lean().exec();
  const IsUserNotExist = !user || (userId && userId !== providerId);

  if (IsUserNotExist) {
    throw new Error(
      "The user ID provided is invalid. Please verify your information and try again."
    );
  }

  cacheUser(providerId, user);

  return user;
}

export function removeUserCache(providerId: string) {
  if (providerId in userCache) delete userCache[providerId];
}

interface IFindExistUserProps {
  providerId?: string;
  authProvider?: string;
}

export async function findExistUser({
  providerId,
  authProvider,
}: IFindExistUserProps) {
  if (!providerId || !authProvider) return;
  const cachedData = userCache[providerId];
  if (cachedData && Date.now() < cachedData.expireAt) return cachedData.user;

  const user = await User.findOne({ providerId, authProvider }).lean().exec();

  if (user) {
    cacheUser(providerId, user);
  }

  return user;
}

function cacheUser(providerId: string, user: MUser): void {
  const expireAt = Date.now() + 1000 * 60 * 30; // 30분
  userCache[providerId] = { user, expireAt };
}

export async function upsertUser(userData: IUser) {
  const result = await User.findOneAndUpdate(
    { providerId: userData.providerId },
    userData,
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();

  if (!result) throw new Error("Failed to create a new user");
}

export async function tokenRegistration(userId: string, twitchToken: string) {
  await User.findByIdAndUpdate(userId, { twitchToken }).lean().exec();
}

export async function removeToken(userId: string) {
  await User.findByIdAndUpdate(userId, {
    twitchToken: null,
  })
    .lean()
    .exec();
}
