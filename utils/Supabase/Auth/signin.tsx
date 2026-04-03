import { supabase } from "../supabase";

const errorMessages: Record<string, string> = {
  "Invalid login credentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  "Email not confirmed":
    "لم يتم تأكيد البريد الإلكتروني بعد، يرجى التحقق من بريدك",
  "Too many requests": "عدد المحاولات كثير جداً، يرجى الانتظار قليلاً",
  "User not found": "لا يوجد حساب بهذا البريد الإلكتروني",
  "Network request failed": "خطأ في الاتصال بالشبكة، يرجى المحاولة لاحقاً",
};

function translateError(msg: string): string {
  for (const [key, val] of Object.entries(errorMessages)) {
    if (msg.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً";
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const client = supabase();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(translateError(error.message));
  return data;
}
