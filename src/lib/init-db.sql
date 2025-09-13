-- 建立用戶表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立專案表
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立計劃摘要表
CREATE TABLE IF NOT EXISTS plan_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  product TEXT,
  service TEXT,
  feature TEXT,
  target TEXT,
  situation TEXT,
  ability TEXT,
  detail_number TEXT,
  analogy TEXT,
  differentiation TEXT,
  opportunity TEXT,
  uniqueness TEXT,
  motivation_and_goal TEXT,
  product_description TEXT,
  key_tasks TEXT,
  outcomes_and_benefits TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立執行規劃表
CREATE TABLE IF NOT EXISTS execution_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  major_projects JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立預算規劃表
CREATE TABLE IF NOT EXISTS budget_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  total_budget DECIMAL,
  self_fund_ratio DECIMAL,
  subsidy_ratio DECIMAL,
  personnel_cost_ratio DECIMAL,
  research_cost_ratio DECIMAL,
  market_validation_ratio DECIMAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立流量獲取表
CREATE TABLE IF NOT EXISTS traffic_acquisitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  strategy TEXT,
  channels TEXT,
  budget DECIMAL,
  timeline TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立聯繫教練表
CREATE TABLE IF NOT EXISTS contact_coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  consultation_type TEXT,
  preferred_time TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立擴充功能表
CREATE TABLE IF NOT EXISTS additional_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  features JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_plan_summaries_project_id ON plan_summaries(project_id);
CREATE INDEX IF NOT EXISTS idx_execution_plans_project_id ON execution_plans(project_id);
CREATE INDEX IF NOT EXISTS idx_budget_plans_project_id ON budget_plans(project_id);
CREATE INDEX IF NOT EXISTS idx_traffic_acquisitions_project_id ON traffic_acquisitions(project_id);
CREATE INDEX IF NOT EXISTS idx_contact_coaches_project_id ON contact_coaches(project_id);
CREATE INDEX IF NOT EXISTS idx_additional_features_project_id ON additional_features(project_id);

-- 建立更新時間的觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plan_summaries_updated_at BEFORE UPDATE ON plan_summaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_execution_plans_updated_at BEFORE UPDATE ON execution_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_plans_updated_at BEFORE UPDATE ON budget_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_traffic_acquisitions_updated_at BEFORE UPDATE ON traffic_acquisitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_coaches_updated_at BEFORE UPDATE ON contact_coaches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_additional_features_updated_at BEFORE UPDATE ON additional_features
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
