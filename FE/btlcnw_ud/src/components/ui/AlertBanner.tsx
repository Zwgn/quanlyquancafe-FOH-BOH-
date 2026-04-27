interface AlertBannerProps {
  error?: string | null;
  success?: string | null;
}

const AlertBanner = ({ error, success }: AlertBannerProps) => (
  <>
    {error ? <p className="alert-error">{error}</p> : null}
    {success ? <p className="alert-success">{success}</p> : null}
  </>
);

export default AlertBanner;
