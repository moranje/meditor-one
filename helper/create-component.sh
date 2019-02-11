cd src/components/"$2"
vgc -s "$1" --spec ts --folder;
vgc "$1" --spec ts --folder;
rm "$1"/"$1".{js,scss,html};
# rm "$1"/index.vue;
mv "$1"/"$1".vue "$1"/index.vue
