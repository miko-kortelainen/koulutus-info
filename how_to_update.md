get latest statistics from vipunen API:  
https://api.vipunen.fi/api/resources/korkeakoulutus_hakeneet_ja_paikan_vastaanottaneet/data?filter=koulutuksenAlkamisvuosi%3D%3D%272026%27%20and%20hakutapa%3D%3D%27Yhteishaku%27%20and%20koulutusasteTaso1%3D%3D%27Alempi%20korkeakouluaste%27

Vipunen swagger api docs:  
https://api.vipunen.fi/api/swagger-ui/index.html

1. get vipunen statistics data
2. run merge.py in ./aputyökalut to merge vipunen (hakijamäärät and aloituspaikat in different items -> script merges them into one)
3. get opintopolku data with api.py
4. run op-vipunen-merge.py to merge opintopolku and vipunen data into one.

#### Resource used: `korkeakoulutus_hakeneet_ja_paikan_vastaanottaneet`

#### FIQL filters used

```sql
koulutuksenAlkamisvuosi=='2026' and hakutapa=='Yhteishaku' and koulutusasteTaso1=='Alempi korkeakouluaste' and aloituspaikatLkm>0
```
