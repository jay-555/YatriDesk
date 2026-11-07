import { redirect } from "next/navigation";

export default function OutletRedirectPage() {
  redirect("/settings");
}
