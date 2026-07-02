Security steps after accidentally committing secrets:

1. Rotate your MongoDB credentials immediately:
   - In MongoDB Atlas, go to Database Access > Users
   - Edit the user `cheikhahmadou92_db_user`, set a new password, or create a new user and remove the old one.

2. Remove the secret from repository history (optional but recommended):
   - Use `git filter-repo` or GitHub's "remove sensitive data" guide to purge secrets from history.

3. Add secrets to Render via Dashboard (do NOT store in repo):
   - Render > Your Service > Environment > Environment Variables
   - Add `MONGO_URI` and `JWT_SECRET` with their values.

4. Restrict Network Access in Atlas:
   - Network Access > Add IP Address
   - For quick testing use `0.0.0.0/0` then restrict to specific IPs later.

5. Invalidate older tokens/secrets where applicable.

6. After rotation, redeploy the Render service.

Helpful commands:

```bash
# Remove file from future commits and push
git rm --cached render.yaml
git commit -m "Remove secrets from repo"
git push origin main

# To purge from history (careful):
# Install git-filter-repo: https://github.com/newren/git-filter-repo
# Example to remove a string
git filter-repo --replace-text replacements.txt
```

If you want, I can:
- Rotate the MongoDB user password (need Atlas access),
- Remove `render.yaml` from history and repository, and
- Keep `render.yaml` with placeholders only.
