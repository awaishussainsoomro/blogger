const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabseID: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteTableID: String(import.meta.env.VITE_APPWRITE_TABLE_ID),
    appwriteBucketID: String(import.meta.env.VITE_APPWRITE_BUCKET_ID)
}

export default conf