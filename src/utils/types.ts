export type AnonymousMessage = {
  id: string;
  message: string;
  email: string;
  created_at: {
    seconds: number;
    nanoseconds: number;
  };
};
