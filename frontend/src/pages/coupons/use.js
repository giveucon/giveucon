import React from 'react';
import { useRouter } from 'next/router'
import QRCode from 'qrcode.react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

function Use({ selfUser }) {

  const router = useRouter();
  const [coupon, setCoupon] = useState(null);
  const [couponQR, setCouponQR] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const couponResponse = await requestToBackend(`api/coupons/${router.query.id}`, 'get', 'json', null, null);
      const couponQRResponse = await requestToBackend(`api/coupons/${router.query.id}`, 'get', 'json', null, {
        type = `qr`,
      });
      const productResponse = await requestToBackend(`api/products/${couponResponse.data.product}`, 'get', 'json', null, null);
      setCoupon(couponResponse.data);
      setCouponQR(couponQRResponse.data);
      setProduct(productResponse.data);
    }
    selfUser && fetch();
  }, [selfUser]);
  
  return (
    <Layout title={`쿠폰 사용 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={product.name}
      >
        <Card>
          <Box display='flex' justifyContent='center' style={{positions: 'responsive'}}> 
            <QRCode
              value={JSON.stringify(couponQR)}
              size={400}
              includeMargin={true}
            />
          </Box>
        </Card>
      </Section>
      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={() => router.back()}
        >
          뒤로가기
        </Button>
      </Box>
    </Layout>
  );
}

export default withAuth(Use);
