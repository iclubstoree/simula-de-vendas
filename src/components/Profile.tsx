import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save } from "lucide-react";
import { useState } from "react";

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Ana Silva",
    email: "ana.silva@iclub.com",
    phone: "(11) 99999-9999",
    role: "Vendedora",
    store: "Castanhal",
    startDate: "Janeiro 2023"
  });

  const handleSave = () => {
    setIsEditing(false);
    // Logic to save user data
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Meu Perfil
          </h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>
        <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </>
          ) : (
            <>
              <Edit3 className="mr-2 h-4 w-4" />
              Editar
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="card-animate hover-float">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4 bg-gradient-primary">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
                AS
              </AvatarFallback>
            </Avatar>
            <CardTitle>{userData.name}</CardTitle>
            <div className="flex gap-2 justify-center">
              <Badge variant="secondary">{userData.role}</Badge>
              <Badge variant="outline">{userData.store}</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Information */}
        <Card className="lg:col-span-2 card-animate hover-float">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store">Loja</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="store"
                    value={userData.store}
                    onChange={(e) => setUserData({...userData, store: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    value={userData.startDate}
                    disabled
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-animate hover-float">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Simulações este mês</p>
            </div>
            <p className="text-2xl font-bold text-primary">34</p>
            <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="card-animate hover-float">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
            </div>
            <p className="text-2xl font-bold text-primary">28.5%</p>
            <p className="text-xs text-muted-foreground">Acima da média</p>
          </CardContent>
        </Card>

        <Card className="card-animate hover-float">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Ticket Médio</p>
            </div>
            <p className="text-2xl font-bold text-primary">R$ 3.200</p>
            <p className="text-xs text-muted-foreground">+5% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}