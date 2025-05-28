---
"frontend": patch
---

Fix user return

If a user was successfully created but none of the user data was returned due to the setWhere clause. Now if there are no errors then consider the user created and return the user data.