import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken");

  if (authToken) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
