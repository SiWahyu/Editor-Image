import AppLayout from "../../../layouts/AppLayout";
import EditImage from "../components/EditImage";
import { useRef } from "react";
import Hero from "../components/hero";

export default function AppPage() {
  const editImageRef = useRef(null);
  return (
    <AppLayout>
      <Hero scrollEditImage={editImageRef} />
      <EditImage editImageRef={editImageRef} />
    </AppLayout>
  );
}
