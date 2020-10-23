import React, { useEffect, useState } from 'react';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Leaflet from 'leaflet';

import mapMarkerImg from '../images/map-marker.svg';

import '../styles/pages/orphanages-map.css';
import api from '../services/api';

const mapIcon = Leaflet.icon({
    iconUrl: mapMarkerImg,
    iconSize: [58, 68],
    iconAnchor: [29, 68],
    popupAnchor: [170, 2],
});

interface Orphanage {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
}

function OrphanagesMap() {

    /* Toda vez que setOrphanages for executada, o retorno dela será atribuído à orphanages */
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

    /*
      CICLO DE RENDERIZAÇÃO:
      Ao carregar a página, esse console.log será exibido duas vezes: Uma vez um array vazio e outra vez um array preenchido
      1. orphanages é declarado como sendo um array vazio = useState([]) -- Guarda o valor inicial
      2. Na execução do useEffect, o retorno da request GET será passado à setOrphanages
      3. A execução de setOrphanages implica em nova renderização do componente em tela e no preenchimento do array orphanages
    
      console.log(orphanages);
    */

    useEffect(() => {
      api.get('orphanages').then(response => {
        /* 
          Na primeira renderização do componente ocorrerá a requisição GET dos orfanatos
          e o array de retorno será passado à setOrphanages
        */
        setOrphanages(response.data);
      });
    }, []);

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy"/>

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Joinville</strong>
                    <span>Santa Catarina</span>
                </footer>
            </aside>

            <Map
                center={[-26.2655395,-48.8296814]}                
                zoom={15}
                /* 
                  chaves externas = será injetado código
                  chaves internas = objeto JS
                */
                style={{ width: '100%', height: '100%' }} 
            >
                {/*<TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/>*/}
                <TileLayer 
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                
                {orphanages.map(orphanage => {
                    return (
                        <Marker
                        icon={mapIcon}
                        position={[orphanage.latitude, orphanage.longitude]}
                        key={orphanage.id}
                        >
                            <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                                {orphanage.name}
                                <Link to={`/orphanages/${orphanage.id}`}>
                                    <FiArrowRight size={32} color="#FFF"/>
                                </Link>
                            </Popup>
                        </Marker>
                    )
                })}
            </Map>

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#fff"/>
            </Link>
        </div>
    );
}

export default OrphanagesMap;