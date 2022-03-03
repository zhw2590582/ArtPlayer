import { setStyle } from '../utils';
import { getPosFromEvent } from './progress';

export default function thumbnails(options) {
    return (art) => ({
        ...options,
        mounted: ($control) => {
            const {
                option,
                template: { $progress, $video },
                events: { proxy, loadImgBlob },
            } = art;
            
            const interval= $video.duration/((option.thumbnails.column*option.thumbnails.row)*option.thumbnails.urls.length);
            const images=[];
            option.thumbnails.urls.forEach(url => {
                images.push({
                    isLoading:false,
                    isLoaded:false,
                    src:null,
                    blob:null,
                    url
                });
            });


            let showingIndex=null;

            function showThumbnails(event) {
                const { width: posWidth,second:seekTime } = getPosFromEvent(art, event);
                const { column, row } = option.thumbnails;

                const imageIndex= Math.ceil( ((seekTime/interval)+1) / (option.thumbnails.column * option.thumbnails.row))-1;

                var getImage= images[imageIndex];

                if(getImage==null) return;

                if(!getImage.isLoading){
                    getImage.isLoading=true;
                    loadImgBlob(getImage.url).then((data)=>{
                        
                        getImage.src=data.image;
                        getImage.blob=data.blob;
                        getImage.isLoaded=true;
                    })
                }

                if (getImage.isLoaded===false) return;

                const width = getImage.src.naturalWidth / row;
                const height= getImage.src.naturalHeight / column;
                const perIndex = Math.floor(seekTime / interval);

                

                if(showingIndex===perIndex) return;
                showingIndex=perIndex;

                const indexInImage= perIndex + 1 - (column * row) * (Math.ceil((perIndex + 1) / (column * row)) - 1)
                const yIndex = Math.ceil(indexInImage / row) - 1;
                const xIndex= indexInImage - yIndex  * row -1;

                setStyle($control, 'display', 'block');
                setStyle($control, 'backgroundImage', `url(${getImage.blob})`);
                setStyle($control, 'height', `${height}px`);
                setStyle($control, 'width', `${width}px`);
                setStyle($control, 'backgroundPosition', `-${xIndex * width}px -${yIndex * height}px`);

                if (posWidth <= width / 2) {
                    setStyle($control, 'left', 0);
                } else if (posWidth > $progress.clientWidth - width / 2) {
                    setStyle($control, 'left', `${$progress.clientWidth - width}px`);
                } else {
                    setStyle($control, 'left', `${posWidth - width / 2}px`);
                }
            }

            proxy($progress, 'mousemove', showThumbnails);

            proxy($progress, 'mouseout', () => {
                setStyle($control, 'display', 'none');
            });
        },
    });
}
