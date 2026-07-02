import { useEffect, useState } from "react";
import { useClients } from "../lib/auth";
import { fmtDate, fmtState } from "../lib/format";
import { create } from "@bufbuild/protobuf";
import { ListInstancesRequestSchema } from "@zitadel/proto/zitadel/instance/v2beta/instance_service_pb.js";

export function InstancesPage() {
  const clients = useClients();
  const [instances, setInstances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clients.instance.listInstances(create(ListInstancesRequestSchema, { queries: [] }))
      .then((res) => setInstances(res.instances ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [clients]);

  if (loading) return <div className="loading">Loading instances...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Instances</h2>
        <p>{instances.length} instance{instances.length !== 1 ? "s" : ""}</p>
      </div>
      {instances.length === 0 ? (
        <div className="empty-state">No instances found</div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>State</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {instances.map((i: any) => {
                const s = fmtState(i.state);
                return (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{i.id}</td>
                    <td><span className={`badge ${s.className}`}>{s.label}</span></td>
                    <td>{fmtDate(i.details?.creationDate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
