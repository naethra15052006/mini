# How to Add Token in Postman (VS Code)

## Step 1: Login to Get Token

1. Create a **NEW REQUEST** in Postman
2. Set it as **POST** method
3. Enter URL: `http://localhost:8080/api/auth/login`
4. Click **Body** tab below the URL
5. Select **raw** and **JSON** from dropdown
6. Enter this in the text box:
   ```json
   {"email": "test@test.com", "password": "123"}
   ```
7. Click **Send** button
8. Look at the **Response** below - you'll see something like:
   ```
   {
     "token": "eyJhbGciOiJIUzI1NiJ9...",
     "user": {...}
   }
   ```
9. **COPY the token** (the long string starting with "eyJ...")

---

## Step 2: Add Token to Headers

1. Go to your **GET /api/jobs** request (or any other request)
2. Look for the **Headers** tab (below where you enter the URL)
3. You will see a table with two columns: **Key** and **Value**
4. In the first empty row:
   - **Key** column: type `Authorization`
   - **Value** column: type `Bearer YOUR_COPIED_TOKEN`
   
   (Replace "YOUR_COPIED_TOKEN" with the token you copied in Step 1)
   
5. It should look like:
   ```
   Key          | Value
   Authorization | Bearer eyJhbGciOiJIUzI1NiJ9...
   ```
6. Click **Send**

---

## Quick Summary

| Tab | What to do |
|-----|------------|
| **Body** | Enter JSON for POST requests |
| **Headers** | Add `Authorization: Bearer YOUR_TOKEN` for protected routes |
| **Params** | Add query parameters for GET requests |

---

## Troubleshooting

- **401 Error**: You're not adding the token correctly
- **403 Error**: Token is valid but you don't have permission (wrong role)
- **404 Error**: Wrong URL - check the endpoint

