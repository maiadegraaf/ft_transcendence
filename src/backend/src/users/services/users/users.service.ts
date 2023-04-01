
async addSocketIdToUser(userId: number, socketId: string): Promise<any> {
  const user = await this.findUserByID(userId);
  if (user.socketId) {
  console.log('Replacing socketId ${user.socketId} with ${socketId} for user ${user.username}');
}
user.socketId = socketId;
return this.saveUser(user);
}

async returnUserBySocketId(socketId: string): Promise<User> {
  return this.userRepository.findOne({ where: { socketId } });
}
}