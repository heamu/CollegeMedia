import { useEffect, useState } from "react";
import SingleMaterial from "./SingleMaterial";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

export default function MaterialPage() {
  const { user: contextUser ,isSelf } = useOutletContext();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // didCancel is used to prevent state updates if the component unmounts before the async fetch finishes.
    // This avoids React warnings about setting state on an unmounted component.
    let didCancel = false;
    async function fetchMaterials() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/material/all-materials/${contextUser._id}`,
          { withCredentials: true }
        );
        if (!didCancel) setMaterials(res.data.materials || []);
      } catch {
        if (!didCancel) setError("Failed to load materials");
      } finally {
        if (!didCancel) setLoading(false);
      }
    }
    if (contextUser?._id) fetchMaterials();
    return () => { didCancel = true; };
  }, [contextUser?._id]);

  if (loading)
    return (
      <div className="text-center text-blue-400 py-10">
        Loading materials...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-400 py-10">{error}</div>
    );

  return (
    <div className="grid grid-cols-3 gap-6 p-4">
      {materials.length === 0 ? (
        <div className="col-span-3 text-center text-gray-400 italic py-8">
          No materials uploaded yet.
        </div>
      ) : (
        materials.map(({ _id, fileId, fileName }) => (
          <SingleMaterial key={_id} fileId={fileId} name={fileName} isSelf={isSelf} user={contextUser} _id={_id} />
        ))
      )}
    </div>
  );
}
