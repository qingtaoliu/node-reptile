cd web/frontend/

echo '开始编译静态资源'
npm run build
echo '结束编译'

echo 'start cp'
cp dist/index.html /srv/apps/node-reptile/web/public/index.html
cp -r dist/static/* /srv/apps/node-reptile/web/public/static/

echo 'end cp'