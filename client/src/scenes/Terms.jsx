import React from "react";
import { Box, Typography, Paper, Divider, Avatar } from "@mui/material";
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';

const Terms = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    sx={{ background: 'linear-gradient(135deg, #e0e7ef 0%, #f5f7fa 100%)' }}
    p={2}
  >
    <Paper elevation={4} sx={{
      maxWidth: 750,
      width: '100%',
      p: { xs: 3, sm: 5 },
      borderRadius: 5,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
      border: '1.5px solid #e3e8f0',
      mx: { xs: 2, sm: 'auto' },
    }}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: '#1a237e', width: 72, height: 72, mb: 1 }}>
          <GavelOutlinedIcon sx={{ fontSize: 40, color: '#fff' }} />
        </Avatar>
        <Typography variant="h3" fontWeight={800} color="#1a237e" fontFamily="'Montserrat', sans-serif" mb={1}>
          Terms & Conditions
        </Typography>
        <Typography color="text.secondary" fontSize={18} mb={2} textAlign="center">
          Please read these terms carefully before using our website or services.
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" fontWeight={700} mt={2} mb={1} color="#1a237e">1. Use of the Website</Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.
      </Typography>
      <Typography variant="h6" fontWeight={700} mt={2} mb={1} color="#1a237e">2. User Accounts</Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account.
      </Typography>
      <Typography variant="h6" fontWeight={700} mt={2} mb={1} color="#1a237e">3. Intellectual Property</Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        All content, trademarks, and data on this website, including but not limited to software, databases, text, graphics, icons, and hyperlinks are the property of the website owner or its licensors and are protected by law.
      </Typography>
      <Typography variant="h6" fontWeight={700} mt={2} mb={1} color="#1a237e">4. Privacy Policy</Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Your use of this website is also governed by our Privacy Policy, which can be found on a separate page.
      </Typography>
      <Typography variant="h6" fontWeight={700} mt={2} mb={1} color="#1a237e">5. Limitation of Liability</Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        The website and its owners will not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, or use of, the website.
      </Typography>
      <Typography variant="h6" fontWeight={700} mt={2} mb={1} color="#1a237e">6. Changes to Terms</Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website constitutes your acceptance of the revised terms.
      </Typography>
      <Typography variant="h6" fontWeight={700} mt={2} mb={1} color="#1a237e">7. Termination</Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        We reserve the right to terminate or suspend your access to the website at our sole discretion, without notice, for conduct that we believe violates these Terms & Conditions or is harmful to other users of the website, us, or third parties, or for any other reason.
      </Typography>
      <Typography variant="h6" fontWeight={700} mt={2} mb={1} color="#1a237e">8. Governing Law</Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        These Terms & Conditions are governed by and construed in accordance with the laws of [Your Country/State], and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
      </Typography>
      <Typography variant="h6" fontWeight={700} mt={2} mb={1} color="#1a237e">9. Contact Us</Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        If you have any questions about these Terms & Conditions, please contact us at [your email/contact page].
      </Typography>
    </Paper>
  </Box>
);

export default Terms; 