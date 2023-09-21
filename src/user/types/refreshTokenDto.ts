export type RefreshTokenDto = {
   client_id: string;
   client_secret: string;
   grant_type: 'refresh_token';
   refresh_token: string;
   redirect_uri: string;
};
