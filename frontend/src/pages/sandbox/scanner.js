import Layout from '../../components/Layout';
import Section from '../../components/Section';
import ScannerCard from '../../components/ScannerCard';

export default function Index() {

  return (
    <Layout title={`스캐너 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>

      <Section title="ScannerCard">
        <ScannerCard />
      </Section>

    </Layout>
  );
}
