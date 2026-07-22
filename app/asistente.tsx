import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { COLORS } from '@/constants/colors';
import { isChatbotConfigured } from '@/constants/chatbot';
import { sendChatMessage, warmUpChatbot, type ChatProduct } from '@/services/chatbot';
import { openWhatsApp } from '@/utils/whatsapp';

interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  productos?: ChatProduct[];
}

const GREETING: UIMessage = {
  id: 'greeting',
  role: 'assistant',
  content:
    'Hola 👋 Soy el asistente de MEGA UNIFORMES. Te ayudo a consultar colegio, prenda, género, talla y disponibilidad. ¿Qué estás buscando?',
};

let counter = 0;
const nextId = () => `m${Date.now()}-${counter++}`;

export default function AsistenteScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<UIMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Al abrir el asistente, "despertamos" el backend de Render en segundo plano
  // para que el primer mensaje no espere el arranque en frío (~30-60 s dormido).
  useEffect(() => {
    warmUpChatbot();
  }, []);

  const scrollToEnd = () => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: UIMessage = { id: nextId(), role: 'user', content: text };
    const history = messages
      .filter((m) => m.id !== 'greeting')
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);
    scrollToEnd();

    try {
      const reply = await sendChatMessage(text, history);
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'assistant', content: reply.response, productos: reply.productos },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          content:
            'No pude conectar con el asistente en este momento. Puedes escribirnos directamente por WhatsApp y te atendemos enseguida.',
        },
      ]);
    } finally {
      setSending(false);
      scrollToEnd();
    }
  };

  return (
    <View style={styles.root}>
      <Header />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 8}
      >
        <View style={styles.titleBar}>
          <View style={styles.avatar}>
            <Ionicons name="chatbubbles" size={20} color={COLORS.navy} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.titleText}>Asistente MEGA UNIFORMES</Text>
            <Text style={styles.titleSub}>Atención inteligente</Text>
          </View>
          <TouchableOpacity
            style={styles.waPill}
            onPress={() => openWhatsApp('Hola, quiero hablar con un asesor de MEGA UNIFORMES')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Hablar con un asesor por WhatsApp"
          >
            <Ionicons name="logo-whatsapp" size={16} color={COLORS.white} />
            <Text style={styles.waPillText}>Asesor</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={scrollToEnd}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Conversación con el asistente"
        >
          {!isChatbotConfigured && (
            <View style={styles.notice}>
              <Ionicons name="information-circle-outline" size={18} color={COLORS.navy} />
              <Text style={styles.noticeText}>
                El asistente inteligente aún no está conectado. Mientras tanto, escríbenos por
                WhatsApp para consultar colegio, prenda, talla y disponibilidad.
              </Text>
            </View>
          )}

          {messages.map((m) => (
            <View key={m.id}>
              <View style={[styles.bubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                <Text style={m.role === 'user' ? styles.bubbleUserText : styles.bubbleBotText}>
                  {m.content}
                </Text>
              </View>

              {m.productos && m.productos.length > 0 && (
                <View style={styles.productList}>
                  {m.productos.map((p, i) => (
                    <View key={`${m.id}-p${i}`} style={styles.productCard}>
                      <Text style={styles.productTitle}>
                        {p.prenda ?? 'Prenda'} · {p.colegio ?? ''}
                      </Text>
                      <Text style={styles.productMeta}>
                        {[p.genero, p.talla ? `Talla ${p.talla}` : null].filter(Boolean).join(' · ')}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          {sending && (
            <View
              style={[styles.bubble, styles.bubbleBot, styles.typing]}
              accessibilityLabel="El asistente está escribiendo"
            >
              <ActivityIndicator size="small" color={COLORS.muted} />
              <Text style={styles.typingText}>El asistente está escribiendo…</Text>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={isChatbotConfigured ? 'Escribe tu consulta…' : 'Asistente no disponible'}
            placeholderTextColor={COLORS.muted}
            editable={isChatbotConfigured && !sending}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            accessibilityLabel="Escribe tu consulta para el asistente"
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!isChatbotConfigured || sending) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!isChatbotConfigured || sending}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensaje"
            accessibilityState={{ disabled: !isChatbotConfigured || sending }}
          >
            <Ionicons name="send" size={18} color={COLORS.navy} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.surface },
  flex: { flex: 1 },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.navy,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
  titleSub: { color: COLORS.gold, fontSize: 11, marginTop: 2 },
  waPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.whatsapp,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  waPillText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  messages: { flex: 1 },
  messagesContent: { padding: 16, gap: 4 },
  notice: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(200, 169, 106, 0.14)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  noticeText: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 19 },
  bubble: {
    maxWidth: '86%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginVertical: 6,
  },
  bubbleBot: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.navy,
    borderBottomRightRadius: 4,
  },
  bubbleBotText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  bubbleUserText: { fontSize: 14, color: COLORS.white, lineHeight: 20 },
  typing: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typingText: { fontSize: 12, color: COLORS.muted },
  productList: { gap: 8, marginBottom: 6 },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
  },
  productTitle: { fontSize: 13, fontWeight: '800', color: COLORS.navy },
  productMeta: { marginTop: 4, fontSize: 12, color: COLORS.muted },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
    color: COLORS.text,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.5 },
});
