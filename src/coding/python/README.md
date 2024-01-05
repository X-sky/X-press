Script `/scripts/python-prepare.ts` will be executed before `dev` or `build`. It has the following effects:

1. all `.ipynb` files will be transformed into pure markdown files

2. all other files including `.md` files will be copied as-is

**NO NEED** to commit transformed markdowns.

Also, should configure the target vitepress path with `/coding/python/markdowns/**`
