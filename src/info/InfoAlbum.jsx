import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import { getFullAlbum, getUserInfo } from '../service/supabase';
import { calculateTotalValue } from '../utils/utils'; // Assicurati di avere questa funzione per calcolare il valore totale

function PopupWrapper({ open, onClose }) {
  const [loading, setLoading] = useState(true);
  const [popupData, setPopupData] = useState('');

  useEffect(() => {
    if (!open) return;

    let ignore = false;

    async function fetchData() {
      setLoading(true);
      try {
        const user = await getUserInfo();
        if (!user) throw new Error("Utente non trovato");

        const album = await getFullAlbum(user.id);
        const coins = album.data;
        const coinsComm = album.dataComm;

        let total = calculateTotalValue(coins);

        total = total + (coinsComm.length * 2);

        if (!ignore) {
         const formatted = `
            <table class="popup-table">
                <tr>
                    <td><b>Numero monete</b></td>
                    <td>${coins.length}</td>
                </tr>
                <tr>
                    <td><b>Monete commemorative</b></td>
                    <td>${coinsComm.length}</td>
                </tr>
                <tr class="total-row">
                    <td><b>Valore totale</b></td>
                    <td>${total}€</td>
                </tr>
            </table>

            `;
          setPopupData(formatted);
        }
      } catch (error) {
        console.error('Errore durante fetch popup:', error);
        if (!ignore) setPopupData('Errore durante il caricamento');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [open]);

  return (
    <Popup
      open={open}
      onClose={onClose}
      title="Il tuo album completo"
      text={loading ? 'Caricamento...' : popupData}
      isHtml={!loading} // Usa HTML solo se caricato
    />
  );
}

export default PopupWrapper;
