# Devops-End-to-End-P4
 End-to-End DevOps Pipeline for a Web Application with CI/CD

Sample Projects 
https://github.com/UnpredictablePrashant/Slab.ai
https://github.com/UnpredictablePrashant/TradingGame



## Project WorkFlow

### End-to-End DevOps CI/CD Communication Flow

**1. Developer Commit (GitHub → Jenkins)**
  * Trigger: Developer pushes code to the GitHub repository.
  * Communication: GitHub Webhook notifies Jenkins.
  * Technology: GitHub Webhooks, Jenkins Git Plugin.

**2. Build Stage (Jenkins → Docker → AWS ECR)**
  * Jenkins pulls latest code from GitHub.
  * Builds Docker image using Dockerfile.
  * Tags the image and pushes it to AWS ECR.
  **Communication**: Jenkins agent ↔ Docker Daemon ↔ AWS ECR (via AWS CLI or ECR plugin).
  **Technology**: Docker, AWS CLI, Jenkins Docker Pipeline Plugin.

**3. Infrastructure Provisioning (Jenkins → Terraform → AWS)**
  Jenkins triggers Terraform scripts stored in repo.  
  Terraform provisions AWS resources:  
   * 1. VPC, Subnets, Security Groups 
   * 2. EKS Cluster, Worker Nodes  
   * 3. EC2 Instances, S3 Buckets (Terraform State)   
  
  **Communication**: Jenkins agent runs Terraform → AWS API via IAM role.  
  **Technology**: Terraform CLI, AWS Provider, S3 Backend for state.

**4. Configuration Management (Jenkins → Ansible → AWS EC2/EKS Nodes)**
  Jenkins runs Ansible playbooks to:  
    * 1. Install Docker, kubectl, monitoring agents.  
    * 2. Configure Kubernetes node settings.  
   **Communication**: Jenkins agent → Ansible → SSH/API calls to EC2 instances/EKS nodes.  
   **Technology**: Ansible, AWS CLI, SSH.
    
**5. Deployment (Jenkins → Kubernetes CLI → AWS EKS)**
  Jenkins uses kubectl to apply Kubernetes manifests:  
   * 1. Deployments  
   * 2. Services (LoadBalancer / Ingress)  
   * 3. ConfigMaps, Secrets  
  **Communication:** Jenkins agent → EKS API via kubectl (authenticated with IAM or kubeconfig).  
  **Technology:** Kubernetes CLI, AWS EKS.

**6. Monitoring & Alerts (Prometheus/Grafana → Jenkins & DevOps Team)**
Prometheus scrapes metrics from:
  1. Application Pods  
  2. EKS Nodes  
  3. AWS CloudWatch metrics  
  Grafana visualizes metrics and sends alerts.  
  Jenkins receives alerts (optional) for failed deployments or infra health issues.  
 **Communication**: Prometheus ↔ Kubernetes API & Node Exporters, Grafana → Email/Slack/Webhook.  
 **Technology**: Prometheus, Grafana, AWS CloudWatch.

 
