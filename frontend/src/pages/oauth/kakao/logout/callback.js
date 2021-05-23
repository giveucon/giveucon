export async function getServerSideProps(context) {
  return {
    redirect: {
      permanent: false,
      destination: `${process.env.NEXT_PUBLIC_BASE_URL}oauth/_common/logout/`,
    },
    props: {}
  };
}

export default function Callback() {

}
