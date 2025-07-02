export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer: string;
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