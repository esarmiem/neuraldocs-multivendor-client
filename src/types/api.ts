export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer: string;
}

export interface ChatDeliaRequest {
  question: string;
  user_level: 'basic' | 'intermediate' | 'advanced';
}

export interface ChatDeliaResponse {
  response: string;
  validation_results: unknown[];
  user_level: 'basic' | 'intermediate' | 'advanced';
  has_edsl_code: boolean;
  edsl_code_blocks_count: number;
  error: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface DocumentStats {
  total_documents: number;
  total_chunks: number;
}

export interface Document {
  id: string;
  filename: string;
  upload_date: string;
  file_size: number;
} 