import AppLayout from "../../../layouts/AppLayout";
import Hero from "../components/Hero";
import EditImage from "../components/EditImage";
import { useRef } from "react";

export default function AppPage() {
  const editImageRef = useRef(null);
  return (
    <AppLayout>
      <Hero scrollEditImage={editImageRef} />
      <EditImage editImageRef={editImageRef} />
    </AppLayout>
  );
}
