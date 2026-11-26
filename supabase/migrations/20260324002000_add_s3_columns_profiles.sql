-- Add S3 storage columns to profiles table
ALTER TABLE "public"."profiles"
ADD COLUMN "avatar_url" "text",
ADD COLUMN "avatar_s3_key" "text",
ADD COLUMN "cover_image_url" "text",
ADD COLUMN "cover_image_s3_key" "text";
-- Add comment documenting the S3 key storage pattern
COMMENT ON COLUMN "public"."profiles"."avatar_s3_key" IS 'Relative S3 key path for user avatar (format: profiles/avatars/{user_id}/{filename})';
COMMENT ON COLUMN "public"."profiles"."cover_image_s3_key" IS 'Relative S3 key path for profile cover image (format: profiles/covers/{user_id}/{filename})';
