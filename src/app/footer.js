import React, { Component } from 'react';
import './footer.css'
import twit from './Icons/twitter.png';
import face from './Icons/facebook.png';

class Footer extends Component{
    render(){
        return  <footer>
        <div class="footer-content">
            
            <div class="footer-section-about">
                <ul>Interes:
                    <li><a href="/Help">Ajuda</a></li>
                    <li><a href="#">Nosaltres</a></li>
                </ul>
            </div>
            
            <div class="footer-section-links">
                <ul>Links:
                    <li><a href="https://www.youtube.com/watch?v=o-cKmAeNJiA">Footer</a></li>
                </ul>
            </div>
            
            <div class="footer-section-social">
                <ul>Segeix-nos!   
                    <div class="imatges-socials">
                        <a href="https://twitter.com/home"><img src={twit} alt="Imatge de Twitter" class="twitter"/></a>
                        <a href="https://www.facebook.com/"><img src={face} alt="Imatge de Facebook" class="facebook"/></a>
                    </div>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            &copy; Matthew Rivero | Luca Berni | Pau Jalencas | Ricard Carrion
        </div>
        <script src="columna.js"></script>
    </footer>
    }
}

export default Footer