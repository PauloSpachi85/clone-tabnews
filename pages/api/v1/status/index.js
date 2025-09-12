function status(request, response) {
  response.status(200).json({ status: 'Servidor ONLINE' });
}
export default status;