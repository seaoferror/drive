실행방법
---
[app.mikekim1032.shop/login](https://app.mikekim1032.shop/login])
> 접속 후 플로우 댓글에 제공된 이메일 비밀번호로 로그인

차단 정책 스키마
---
```sql
CREATE TABLE blocked_extension (
    id UUID NOT NULL,
    name VARCHAR(20) NOT NULL,
    deleted_at TIMESTAMPTZ NULL,
    created_by_member_id UUID NOT NULL,
    deleted_by_member_id UUID NULL,
    team_id UUID NOT NULL,
    CONSTRAINT blocked_extension_pkey PRIMARY KEY (id ASC),
    INDEX idx_blocked_extension_team_deleted (team_id ASC, deleted_at ASC)
);
```


Architecture
---
```mermaid
flowchart TB
 subgraph Vercel_Env["Vercel"]
        Frontend["Frontend Application"]
  end
 subgraph CF_Env["Cloudflare Network"]
        Edge(("Cloudflare Edge"))
  end
 subgraph Grafana_Cloud["Grafana Cloud"]
        Loki[("Loki / Logs")]
  end
 subgraph GCP_Env["Google Cloud Platform"]
        Cockroach[("CockroachDB")]
  end
 subgraph K3s_Cluster["k3s Cluster(homelab)"]
        Cloudflared["cloudflared daemon"]
        Envoy["Envoy Gateway"]
        Auth["Auth Server(k8s deployment)"]
        FileSvc["File Service Server(k8s deployment)"]
        Alloy(["Grafana Alloy"])
  end
    Client(["Client / Browser"]) -- Loads UI --> Frontend
    Client -- API Requests --> Edge
    Edge <== Secure Tunnel ==> Cloudflared
    Cloudflared -- Ingress Traffic --> Envoy
    Envoy -- httpRoute: /auth-file --> Auth
    Envoy -- httpRoute: /fileserver --> FileSvc
    Auth <-- SQL over TLS --> Cockroach
    FileSvc <-- SQL over TLS --> Cockroach
    Auth -. Logs .-> Alloy
    FileSvc -. Logs .-> Alloy
    Alloy == Export Logs via HTTPS ==> Loki
```
#

이외 member, team, metadata 스키마
---
```sql
CREATE TABLE public.member (
    id UUID NOT NULL,
    team_id UUID NOT NULL,
    email STRING NOT NULL,
    name STRING NOT NULL,
    password STRING NOT NULL,
    "role" STRING NOT NULL,
    CONSTRAINT member_pkey PRIMARY KEY (id ASC)
);
```
```sql
CREATE TABLE public.team (
  number_of_blocked_custom_extensions INT8 NOT NULL,
  id UUID NOT NULL,
  name STRING NOT NULL,
  CONSTRAINT team_pkey PRIMARY KEY (id ASC)
);
```

```sql
CREATE TABLE public.metadata (
    id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    extension VARCHAR(255) NOT NULL,
    created_by_member_id UUID NOT NULL,
    deleted_at TIMESTAMPTZ NULL,
    deleted_by_member_id UUID NULL,
    team_id UUID NOT NULL,
    CONSTRAINT metadata_pkey PRIMARY KEY (id ASC)
);
```