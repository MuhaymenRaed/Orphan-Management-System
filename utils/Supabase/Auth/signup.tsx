import { supabase } from "../supabase";

const errorMessages: Record<string, string> = {
  "User already registered": "هذا البريد الإلكتروني مسجل بالفعل",
  "Password should be at least": "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
  "Unable to validate email": "البريد الإلكتروني غير صالح",
  "Signup is disabled": "التسجيل معطل حالياً",
  "Too many requests": "عدد المحاولات كثير جداً، يرجى الانتظار قليلاً",
  "Network request failed": "خطأ في الاتصال بالشبكة، يرجى المحاولة لاحقاً",
};

function translateError(msg: string): string {
  for (const [key, val] of Object.entries(errorMessages)) {
    if (msg.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً";
}

export async function signUp({
  email,
  password,
  fullName,
}: {
  email: string;
  password: string;
  fullName?: string;
}) {
  const client = supabase();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: fullName ? { data: { full_name: fullName } } : undefined,
  });
  if (error) throw new Error(translateError(error.message));
  return data;
}
