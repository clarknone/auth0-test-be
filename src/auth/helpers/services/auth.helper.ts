import { UserDocument } from 'src/auth/schema/auth.schema';

export async function bruteForceCheck(user: UserDocument): Promise<boolean> {
  let result = false;
  const maxTime = 5;
  if (user.attempt < maxTime) {
    result = true;
  } else {
    const timeDiff = new Date().getMilliseconds() - (user.last_attempt?.getMilliseconds() || 0);
    const minutesPassed = Math.floor(timeDiff / 1000 / 60);
    if (minutesPassed >= maxTime) {
      result = true;
    }
  }
  user.last_attempt = new Date();
  user.attempt += 1;
  await user.save();
  return result;
}
